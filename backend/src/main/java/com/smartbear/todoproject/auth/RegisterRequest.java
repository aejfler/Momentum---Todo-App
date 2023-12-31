package com.smartbear.todoproject.auth;

import com.smartbear.todoproject.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String firstname;
    private String username;
    private String email;
    private String password;
    private Role role;
}
