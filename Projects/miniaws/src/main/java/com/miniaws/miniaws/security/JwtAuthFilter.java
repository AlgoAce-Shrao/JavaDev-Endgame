package com.miniaws.miniaws.security;

import com.miniaws.miniaws.entity.AppUser;
import com.miniaws.miniaws.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Slf4j
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
    private final UserRepository userRepository;

    private final AuthUtil authUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        //We need to extract the authorization token from the request:
        /*Steps:
        1. extract the authorization header✅
        2. pass a check if the authorization header is null(as in public endpoint) or it doesn't have the proper authorization header...then pass on✅
            Why pass on:: If we reject it here only no request will be allowed ever...so we let it move on by saying it isn't authennticated..and let spring security decide about it
        3. if authorization header exists... extract the token...
            Bearer ifbwegbug4tuh157yy387ytiugbeiu  (after space this is the token)✅
        4. now get the payloads from the token..cuz the payload consists of all the details about the client✅
        5.fetch the authenticated user from the payloads
        6.The authenticated user is then set into the SecurityContext, which is stored in the SecurityContextHolder. The SecurityContext is now accessible throughout the application and is used to retrieve the authenticated user's details. and be used for each and every authenticate request


        * */

        log.info("incoming request: {}",request.getRequestURI());

        final String requestHeader=request.getHeader("Authorization");   //why Authorization --> since in postman we set it by this name only

        if(requestHeader ==null || !requestHeader.startsWith("Bearer ")){
            filterChain.doFilter(request,response);
            return;
        }

        String token=requestHeader.split("Bearer ")[1];
        String username=authUtil.getUsernameFromToken(token);

        if(username!=null && SecurityContextHolder.getContext().getAuthentication()==null){
            AppUser appuser=userRepository.findUserByUsername(username).orElseThrow(()->new UsernameNotFoundException("User not found"));


            UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken=new UsernamePasswordAuthenticationToken(appuser,null,appuser.getAuthorities());

            SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);

        }
            filterChain.doFilter(request,response);


    }

}
