package com.loja.erp;

import com.loja.erp.usuario.Usuario;
import com.loja.erp.usuario.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Classe principal da aplicação ERP da Loja.
 *
 * <h2>Convenção de nomenclatura</h2>
 * Domínio em PT-BR ({@code Produto}, {@code cadastrarCliente}). Sufixos de
 * papel arquitetural permanecem em inglês ({@code Service}, {@code Controller},
 * {@code Repository}, {@code Mapper}, {@code Dto}, {@code Exception}, {@code Config}).
 *
 * <h2>Seed de dados</h2>
 * Cria um usuário {@code admin / admin123} no primeiro startup, caso ainda não exista.
 */
@SpringBootApplication
public class ErpApplication {

    public static void main(String[] args) {
        SpringApplication.run(ErpApplication.class, args);
    }

    /**
     * CommandLineRunner que insere o usuário admin padrão para login inicial.
     * Roda uma única vez no startup. Em produção, removeria-se este bean.
     */
    @Bean
    CommandLineRunner seedUsuarioAdmin(UsuarioRepository usuarioRepository,
                                       PasswordEncoder passwordEncoder) {
        return args -> {
            if (usuarioRepository.findByUsername("admin").isEmpty()) {
                Usuario admin = Usuario.builder()
                        .username("admin")
                        .senha(passwordEncoder.encode("admin123"))
                        .role("ADMIN")
                        .ativo(true)
                        .build();
                usuarioRepository.save(admin);
            }
        };
    }
}
