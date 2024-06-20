package com.example.machinemanager.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "user")
@NamedQuery(name = "User.findAll", query = "SELECT u from User u")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    private String name;

    private String lastName;

    private String email;

    private String password;

    @JsonIgnore
    @OneToMany(mappedBy = "createdBy", fetch =  FetchType.EAGER)
    private List <Machine> machinesList;

    @ManyToMany
    @JoinTable(
            name = "users_permissions",
            joinColumns = @JoinColumn(name = "userId", referencedColumnName = "userId"),
            inverseJoinColumns = @JoinColumn(name = "permissionId", referencedColumnName = "permissionId")
    )

    private List<Permission> permissions;

    public User(){}

    public User(String name, String lastName, String email, String password, List<Permission> permissions) {
        this.name = name;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.permissions = permissions;
    }


    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<Permission> getPermissions() {
        return permissions;
    }

    public void setPermissions(List<Permission> permissions) {
        this.permissions = permissions;
    }

    public List<Machine> getMachinesList() {
        return machinesList;
    }

    public void setMachinesList(List<Machine> machinesList) {
        this.machinesList = machinesList;
    }

    @Override
    public String toString() {
        return "User{" +
                "permissions=" + permissions +
                '}';
    }
}