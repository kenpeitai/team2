package com.example.demo.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.Statement;
import java.util.stream.Collectors;

@Configuration
public class SQLiteConfig {

    @Autowired
    private DataSource dataSource;

    @Bean
    public CommandLineRunner sqliteInitializer() {
        return args -> {
            try (Connection connection = dataSource.getConnection();
                 Statement statement = connection.createStatement()) {
                
                // 设置SQLite特定的PRAGMA
                statement.execute("PRAGMA foreign_keys = ON");
                statement.execute("PRAGMA journal_mode = WAL");
                statement.execute("PRAGMA synchronous = NORMAL");
                statement.execute("PRAGMA cache_size = 10000");
                statement.execute("PRAGMA temp_store = MEMORY");
                
                System.out.println("SQLite数据库配置完成");
                
            } catch (Exception e) {
                System.err.println("SQLite配置失败: " + e.getMessage());
                e.printStackTrace();
            }
        };
    }

    @Bean
    public CommandLineRunner sqliteTriggerInitializer(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                // 读取并执行SQLite触发器脚本
                ClassPathResource resource = new ClassPathResource("init-sqlite.sql");
                String sqlScript = new BufferedReader(new InputStreamReader(resource.getInputStream()))
                        .lines()
                        .collect(Collectors.joining("\n"));
                
                // 分割SQL语句并执行
                String[] statements = sqlScript.split(";");
                for (String statement : statements) {
                    String trimmed = statement.trim();
                    if (!trimmed.isEmpty() && !trimmed.startsWith("--")) {
                        try {
                            jdbcTemplate.execute(trimmed);
                        } catch (Exception e) {
                            // 忽略触发器已存在的错误
                            if (!e.getMessage().contains("already exists")) {
                                System.err.println("执行SQL失败: " + trimmed);
                                System.err.println("错误: " + e.getMessage());
                            }
                        }
                    }
                }
                
                System.out.println("SQLite触发器配置完成");
                
            } catch (Exception e) {
                System.err.println("SQLite触发器配置失败: " + e.getMessage());
                e.printStackTrace();
            }
        };
    }
}
