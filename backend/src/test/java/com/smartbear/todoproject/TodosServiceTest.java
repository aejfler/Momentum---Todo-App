package com.smartbear.todoproject;

import com.smartbear.todoproject.entities.Todos;
import com.smartbear.todoproject.entities.User;
import com.smartbear.todoproject.enums.Priority;
import com.smartbear.todoproject.enums.Role;
import com.smartbear.todoproject.repositories.TodosRepository;
import com.smartbear.todoproject.services.impl.EmailServiceImpl;
import com.smartbear.todoproject.services.impl.TodosServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.text.ParseException;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import static org.junit.jupiter.api.Assertions.assertEquals;


@ExtendWith(MockitoExtension.class)
class TodosServiceTest {

    @Mock
    private TodosRepository todosRepository;
    @Mock
    private EmailServiceImpl emailService;

    @InjectMocks
    private TodosServiceImpl todosService;

    private User testUser;
    private Todos testTodo;

    @BeforeEach
    void setUp() {
        testUser = new User(1, "Test User", "testUser", "testuser@test.com",
                "$2a$10$uyERskfOHJoMUZXSOqvcxOkXxV3558kxvwe97QfGoo.L2m5v5p4C.", Role.USER);

        testTodo = Todos.builder()
                .id(2)
                .name("Test Todo 2")
                .duedate(new Date())
                .priority(Priority.LOW)
                .user(testUser)
                .build();
    }

    @Test
    @DisplayName("Add Todo Test")
    void addTodoTest() throws ParseException {
        Todos newTodo = Todos.builder()
                .name("Test Todo 1")
                .duedate(new Date(System.currentTimeMillis() + 86400000))
                .created(new Date())
                .priority(Priority.HIGH)
                .user(testUser)
                .build();

        when(todosRepository.save(any(Todos.class))).thenReturn(newTodo);

        Todos addedTodo = todosService.addTodo(newTodo);

        assertEquals(newTodo, addedTodo);
    }


    @Test
    @DisplayName("Update Todo Test")
    void updateTodoTest() {
        when(todosRepository.findById(2L)).thenReturn(java.util.Optional.ofNullable(testTodo));
        when(todosRepository.save(any(Todos.class))).thenReturn(testTodo);

        Todos newTodo = Todos.builder()
                .name("Test Todo 11")
                .duedate(new Date(System.currentTimeMillis() + 86400000))
                .created(new Date())
                .priority(Priority.HIGH)
                .user(testUser)
                .build();

        Todos updatedTodo = todosService.updateTodo(2L, newTodo);

        assertEquals("Test Todo 11", updatedTodo.getName());

        verify(todosRepository).findById(2L);
        verify(todosRepository).save(any(Todos.class));
    }

    @Test
    @DisplayName("Set Completed Test")
    void setCompletedTest() {
        when(todosRepository.findById(1L)).thenReturn(java.util.Optional.ofNullable(testTodo));

        todosService.setCompleted(1L, true);

        assertTrue(testTodo.isCompleted());

        verify(todosRepository).findById(1L);
        verify(todosRepository).save(any(Todos.class));
    }

    @Test
    @DisplayName("Delete Todo Test")
    void deleteTodoTest() {
        todosService.deleteTodo(1L);
        verify(todosRepository).deleteById(1L);
    }


    @Test
    @DisplayName("Send Email Notification Test")
    void sendEmailNotificationTest() {
        testTodo.setDuedate(new Date());

        todosService.sendEmailNotification(testTodo);

        verify(emailService).sendNotification(any(String.class), any(String.class), any(String.class));
    }

}
