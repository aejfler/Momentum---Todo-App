package com.smartbear.todoproject.services;

import com.smartbear.todoproject.entities.Todos;
import com.smartbear.todoproject.entities.User;
import com.smartbear.todoproject.enums.Priority;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;

public interface TodosService {
    List<Todos> getAllTodos();

    List<Todos> findAllByDuedateAndUserId();

    List<Todos> getSortedTodosForUser(User username, Priority priority);

    Todos getById(long id);

    User getLoggedInUser();

    Todos addTodo(Todos todo);

    Todos updateTodo(Long id, Todos todoToBeUpdated);

    void setCompleted(Long id, Boolean isCompleted);

    void deleteTodo(Long todo_id);

    List<Todos> checkDueForTodos();

    default long calculateTimeDifference(LocalDateTime startDate, LocalDateTime endDate) {
        return ChronoUnit.MINUTES.between(startDate, endDate);
    }

    void sendEmailNotification(Todos todo);

    Todos saveOrUpdate(Todos todo);
}
