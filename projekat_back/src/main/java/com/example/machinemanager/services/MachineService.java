package com.example.machinemanager.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.machinemanager.model.Machine;
import com.example.machinemanager.model.User;
import com.example.machinemanager.repository.MachineRepository;

@Service
public class MachineService {
    private MachineRepository machineRepository;

    @Autowired
    public MachineService(MachineRepository machineRepository) {
        this.machineRepository = machineRepository;
    }

    public List<Machine> findAll(){return (List<Machine>) machineRepository.findAll();}


    public Optional<Machine> findById(Long machineId){
        return machineRepository.findById(machineId);
    }

    public List<Machine> findForUser(User user){
        List<Machine> machineList = new ArrayList<>();
        machineList.addAll(machineRepository.findAll());
        List<Machine> usersMachines = new ArrayList<>();
        for(Machine m : machineList){
            if(m.getCreatedBy().equals(user) && m.isActive()){
                usersMachines.add(m);
            }
        }
        return usersMachines;
    }
    public Machine save(Machine machine) {
        return machineRepository.save(machine);
    }

}
