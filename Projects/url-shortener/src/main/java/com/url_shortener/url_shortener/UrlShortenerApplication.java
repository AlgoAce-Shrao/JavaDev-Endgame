package com.url_shortener.url_shortener;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Component;

@SpringBootApplication
@ComponentScan
public class UrlShortenerApplication {

	public static void main(String[] args) {

		SpringApplication.run(UrlShortenerApplication.class, args);
	}

}
