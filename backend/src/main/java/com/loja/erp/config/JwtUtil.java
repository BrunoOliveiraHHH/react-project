package com.loja.erp.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Utilitário JWT — geração, validação e extração de claims.
 *
 * Algoritmo: HS256. Segredo carregado de {@code app.jwt.secret}.
 */
@Component
public class JwtUtil {

    private final SecretKey chave;
    private final long expiracaoMs;

    public JwtUtil(@Value("${app.jwt.secret}") String segredo,
                   @Value("${app.jwt.expiration-ms}") long expiracaoMs) {
        this.chave = Keys.hmacShaKeyFor(segredo.getBytes(StandardCharsets.UTF_8));
        this.expiracaoMs = expiracaoMs;
    }

    public String gerarToken(String username) {
        Date agora = new Date();
        Date expira = new Date(agora.getTime() + expiracaoMs);
        return Jwts.builder()
                .subject(username)
                .issuedAt(agora)
                .expiration(expira)
                .signWith(chave)
                .compact();
    }

    public String extrairUsername(String token) {
        return obterClaims(token).getSubject();
    }

    public boolean tokenValido(String token) {
        try {
            return obterClaims(token).getExpiration().after(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    private Claims obterClaims(String token) {
        return Jwts.parser()
                .verifyWith(chave)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
