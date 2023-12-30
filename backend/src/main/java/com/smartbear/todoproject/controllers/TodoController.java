package com.smartbear.todoproject.controllers;

import com.smartbear.todoproject.enums.Priority;
import com.smartbear.todoproject.entities.Todos;
import com.smartbear.todoproject.services.impl.TodosServiceImpl;
import com.smartbear.todoproject.entities.User;
import com.smartbear.todoproject.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;



@RestController
@CrossOrigin("http://localhost:3000/")
@RequestMapping("/api/todos")

public class TodoController {

    private final TodosServiceImpl todosService;
    private final UserRepository userRepository;

    public TodoController(TodosServiceImpl todosService, UserRepository userRepository) {
        this.todosService = todosService;
        this.userRepository = userRepository;
    }


    @GetMapping("/")
    @PreAuthorize("isAuthenticated()")
    public List<Todos>getAllTodos() {
        User user = getLoggedInUser();
        if (user != null) {
            return todosService.findAllByDuedateAndUserId();
        }
        return todosService.getAllTodos();
    }

    @GetMapping("/{id}")
    public Todos getById(@PathVariable long id) {
        return todosService.getById(id);
    }

    @PostMapping("/add")
    public ResponseEntity<Todos> addTodo(@RequestBody Todos todo) {
        Todos newTodo = todosService.addTodo(todo);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(newTodo);
    }

    public User getLoggedInUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null ) {
            String user = authentication.getName();
            return userRepository.findByEmail(user).orElseThrow(() -> new UsernameNotFoundException("User was not found!" + user));
        }
        return null;
    }
    @GetMapping("/sorted/{priority}")
    public List<Todos> getSortedTodos(@PathVariable Priority priority) {
        User loggedInUser = getLoggedInUser();
        int userId = loggedInUser != null ? loggedInUser.getId() : 0;

        if (userId > 0 && priority != null) {
            return todosService.getSortedTodosForUser(loggedInUser, priority);
        } else {
            return Collections.emptyList();
        }
    }


    @PatchMapping("/{id}")
    public ResponseEntity<String> setCompleted(@PathVariable Long id, @RequestBody Map<String, Boolean> request) {
        Boolean completed = request.get("completed");
        if (completed == null) {
            return ResponseEntity.badRequest().body("Invalid 'completed' value");
        }
        todosService.setCompleted(id, completed);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body("Todo was set to " + completed + " !");
    }

    @DeleteMapping("/delete/{id}")
    public void deleteTodo(@PathVariable("id") Long id) {
        todosService.deleteTodo(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Todos> updateTodo(@PathVariable Long id, @RequestBody Todos updatedTodo) {
        Todos todo = todosService.updateTodo(id, updatedTodo);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(todo);
    }
}
