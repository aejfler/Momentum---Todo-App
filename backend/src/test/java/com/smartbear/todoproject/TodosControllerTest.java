package com.smartbear.todoproject;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartbear.todoproject.controllers.TodoController;
import com.smartbear.todoproject.entities.Todos;
import com.smartbear.todoproject.entities.User;
import com.smartbear.todoproject.enums.Priority;
import com.smartbear.todoproject.repositories.UserRepository;
import com.smartbear.todoproject.services.impl.TodosServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import java.util.Collections;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class TodoControllerTest {

    @Mock
    private TodosServiceImpl todosService;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TodoController todoController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(todoController).build();
    }

    @Test
    @DisplayName("Get All Todos Test")
    void getAllTodosTest() throws Exception {
        when(todosService.findAllByDuedateAndUserId()).thenReturn(Collections.singletonList(new Todos()));

        mockMvc.perform(get("/api/todos/").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @DisplayName("Get Todo By Id Test")
    void getByIdTest() throws Exception {
        when(todosService.getById(anyLong())).thenReturn(new Todos());

        mockMvc.perform(get("/api/todos/1").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isMap());
    }

    @Test
    @DisplayName("Add Todo Test")
    void addTodoTest() throws Exception {
        Todos newTodo = new Todos();
        when(todosService.addTodo(any(Todos.class))).thenReturn(newTodo);

        mockMvc.perform(post("/api/todos/add")
                        .content(new ObjectMapper().writeValueAsString(newTodo))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$").isMap());
    }

    @Test
    @DisplayName("Get Sorted Todos Test")
    void getSortedTodosTest() throws Exception {
        when(todosService.getSortedTodosForUser(any(User.class), any(Priority.class))).thenReturn(Collections.singletonList(new Todos()));

        mockMvc.perform(get("/api/todos/sorted/HIGH").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @DisplayName("Set Completed Test")
    void setCompletedTest() throws Exception {
        doNothing().when(todosService).setCompleted(anyLong(), anyBoolean());

        mockMvc.perform(patch("/api/todos/1")
                        .content(new ObjectMapper().writeValueAsString(Collections.singletonMap("completed", true)))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        verify(todosService, times(1)).setCompleted(anyLong(), anyBoolean());
    }

    @Test
    @DisplayName("Delete Todo Test")
    void deleteTodoTest() throws Exception {
        mockMvc.perform(delete("/api/todos/delete/1").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        verify(todosService, times(1)).deleteTodo(anyLong());
    }

    @Test
    @DisplayName("Update Todo Test")
    void updateTodoTest() throws Exception {
        Todos updatedTodo = new Todos();
        when(todosService.updateTodo(anyLong(), any(Todos.class))).thenReturn(updatedTodo);

        mockMvc.perform(put("/api/todos/1")
                        .content(new ObjectMapper().writeValueAsString(updatedTodo))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isMap());
    }
}
