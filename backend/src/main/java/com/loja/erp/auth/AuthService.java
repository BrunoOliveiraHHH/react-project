package com.loja.erp.auth;

import com.loja.erp.auth.dto.LoginRequestDto;
import com.loja.erp.auth.dto.LoginResponseDto;
import com.loja.erp.config.JwtUtil;
import com.loja.erp.usuario.Usuario;
import com.loja.erp.usuario.UsuarioRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UsuarioRepository usuarioRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponseDto autenticar(LoginRequestDto dto) {
        Usuario usuario = usuarioRepository.findByUsername(dto.username())
                .orElseThrow(() -> new BadCredentialsException("Credenciais inválidas."));

        if (!Boolean.TRUE.equals(usuario.getAtivo())
                || !passwordEncoder.matches(dto.senha(), usuario.getSenha())) {
            throw new BadCredentialsException("Credenciais inválidas.");
        }

        String token = jwtUtil.gerarToken(usuario.getUsername());
        return new LoginResponseDto(token, usuario.getUsername(), usuario.getRole());
    }
}
