package com.smartbear.todoproject.services.impl;

import com.smartbear.todoproject.enums.Priority;
import com.smartbear.todoproject.entities.Todos;
import com.smartbear.todoproject.repositories.TodosRepository;
import com.smartbear.todoproject.entities.User;
import com.smartbear.todoproject.services.TodosService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class TodosServiceImpl implements TodosService {
    private final TodosRepository todosRepository;
    private final EmailServiceImpl emailServiceImpl;

    public TodosServiceImpl(TodosRepository todosRepository, EmailServiceImpl emailServiceImpl) {
        this.todosRepository = todosRepository;
        this.emailServiceImpl = emailServiceImpl;
    }


    @Override
    public List<Todos> getAllTodos() {
        User user = getLoggedInUser();
        return todosRepository.findAllByDuedate().stream()
            .filter(todos -> todos.getUser().getId().equals(user.getId()))
            .collect(Collectors.toList());
    }
    @Override
    public List<Todos> findAllByDuedateAndUserId() {
        User user = getLoggedInUser();
        return todosRepository.findAllByDuedateAndUserId(user.getId());
    }

    @Override
    public List<Todos> getSortedTodosForUser(User username, Priority priority) {
        Sort sort = Sort.by("priority");
        if (Priority.HIGH.equals(priority)) {
            return todosRepository.findAllByUserOrderByPriorityAsc(username, sort);
        }
        return todosRepository.findAllByUserOrderByPriorityDesc(username, sort);
    }

    @Override
    public Todos getById(long id) {
        Optional<Todos> todoById = todosRepository.findById(id);
        if (todoById.isPresent()) {
            return todoById.get();
        } else {
            throw new NoSuchElementException("Your TODO was not found!");
        }
    }

    @Override
    public User getLoggedInUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        return (User) authentication.getPrincipal();
    }
    @Override
    public Todos addTodo(Todos todo) {
        if (todo.getDuedate() != null && todo.getDuedate().before(new Date())) {
            throw new IllegalArgumentException("Deadline for todo must be in the future!");
        }

        User loggedUser = getLoggedInUser();

        Todos newTodo = Todos.builder()
                .user(loggedUser)
                .name(todo.getName())
                .created(todo.getCreated())
                .duedate(todo.getDuedate())
                .priority(todo.getPriority())
                .build();
        System.out.println("added todo with due from service: " + todo.getDuedate());
        return todosRepository.save(newTodo);
    }


    @Override
    public Todos updateTodo(Long id, Todos todoToBeUpdated) {
        Todos existingTodo = todosRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Todo with that ID was not found"));

        existingTodo.setName(todoToBeUpdated.getName());
        existingTodo.setDuedate(todoToBeUpdated.getDuedate());
        existingTodo.setPriority(todoToBeUpdated.getPriority());
        return todosRepository.save(existingTodo);
    }

    @Override
    public void setCompleted(Long id, Boolean isCompleted) {
        Todos todoToComplete = todosRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Todo with that ID was not found"));
        todoToComplete.setCompleted(isCompleted);
        todosRepository.save(todoToComplete);
    }

    @Override
    public void deleteTodo(Long todo_id) {
        todosRepository.deleteById(todo_id);
    }

    @Override
    public List<Todos> checkDueForTodos() {
        List<Todos> todos = todosRepository.findAll();
        LocalDateTime currentDateTime = LocalDateTime.now().plusHours(1);
        LocalDateTime fiveMinutesLater = currentDateTime.plusMinutes(5);

        List<Todos> todosToNotify = new ArrayList<>();

        for (Todos todo : todos) {
            LocalDateTime todoDueDate = todo.getDuedate().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
            long diff = calculateTimeDifference(currentDateTime, fiveMinutesLater);
            long todoDue = calculateTimeDifference(currentDateTime, todoDueDate);

            if (diff == 5 && todoDue <= 5 && todoDue >= 0) {
                todosToNotify.add(todo);
            }
        }
        return todosToNotify;

    }

    @Override
    public void sendEmailNotification(Todos todo) {

        String to = todo.getUser().getEmail();
        String subject = "Notification from your TODO App!!!";
        String body = todo.getName() + " - scheduled for: " + todo.getDuedate() + " is not mark as COMPLETED! \n"
                + "It's due is within 5 minutes! Hurry Up!";

        System.out.println("Notification email was sent");
        emailServiceImpl.sendNotification(to, subject, body);

    }

    @Override
    public Todos saveOrUpdate(Todos todo) {
        return todosRepository.save(todo);
    }


}
