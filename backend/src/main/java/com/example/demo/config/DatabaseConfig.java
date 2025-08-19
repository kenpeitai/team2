package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableJpaRepositories(basePackages = "com.example.demo.repository")
@EnableTransactionManagement
public class DatabaseConfig {
    
    // 这里可以添加自定义的数据库配置
    // 比如自定义的DataSource、EntityManagerFactory等
    
    // 注意：Spring Boot会自动配置大部分数据库相关的Bean
    // 如果需要特殊配置，可以在这里添加
}
