package com.url_shortener.url_shortener.repository;


import com.url_shortener.url_shortener.entity.URLMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface URLRepository extends JpaRepository<URLMapping,Long> {

    Optional<URLMapping> findByShortCode(String shortCode);

}
