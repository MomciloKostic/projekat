package com.example.machinemanager.services;

public interface IService<T, ID> {
    <S extends T> S save(S var1);

}
