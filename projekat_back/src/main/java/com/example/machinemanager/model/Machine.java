package com.example.machinemanager.model;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;

@Entity
@Table(name = "machine")
@NamedQuery(name = "Machine.findAll", query = "SELECT m FROM Machine m")
public class Machine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long machineId;

    private String name;

    @Enumerated(EnumType.STRING)
    private Status status = Status.STOPPED;

    private boolean active = true;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User createdBy;


    private Date destroyDate;


    private Date createDate = new Date();

    public Machine(String name) {
        this.name = name;
    }

    public Machine(){};

    public Long getMachineId() {
        return machineId;
    }

    public void setMachineId(Long machineId) {
        this.machineId = machineId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public Date getDestroyDate() {
        return destroyDate;
    }

    public void setDestroyDate(Date destroyDate) {
        this.destroyDate = destroyDate;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    @Override
    public String toString() {
        return "Machine{" +
                "machineId=" + machineId +
                ", name='" + name + '\'' +
                ", status=" + status +
                ", active=" + active +
                ", createdBy=" + createdBy +
                ", destroyDate=" + destroyDate +
                ", createDate=" + createDate +
                '}';
    }
}
