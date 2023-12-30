package com.smartbear.todoproject.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.smartbear.todoproject.enums.Priority;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;


@Data
@Builder
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name= "todos")
public class Todos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    private String name;
    private Date created;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm", locale = "pl-PL", timezone = "UTC")
    private Date duedate;

    @Enumerated(EnumType.STRING)
    protected Priority priority;

    private boolean completed;

    private boolean notificationSent;

}
