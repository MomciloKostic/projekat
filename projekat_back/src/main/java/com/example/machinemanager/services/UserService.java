package com.example.machinemanager.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.machinemanager.model.User;
import com.example.machinemanager.repository.UserRepository;

@Service
public class UserService implements UserDetailsService, IService<User, Long> {

    private UserRepository userRepository;


    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = this.userRepository.findByEmail(email);
        if(user == null) {
            throw new UsernameNotFoundException("Email " + email + " not found");
        }
        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), new ArrayList<>());
    }

    /*public List<Permission> getPermissionForUser(Long id){
        Iterable<Permission> iter = permissionRepository.permAccess(id);
        List<Permission> rez = new ArrayList<Permission>();
        iter.forEach(rez::add);
        return rez;
    }*/

    public User loadUserByEmail(String email) {
        User user = this.userRepository.findByEmail(email);
        System.out.println(user.getPermissions());
        return user;

    }


    public List<User> findAll() {
        return (List<User>) userRepository.findAll();
    }

    public void deleteById(Long userId){
        userRepository.deleteById(userId);
    }

    public Optional<User> findById(Long userId){
        return userRepository.findById(userId);
    }

    @Override
    public <S extends User> S save(S var1) {
        return userRepository.save(var1);
    }
}
