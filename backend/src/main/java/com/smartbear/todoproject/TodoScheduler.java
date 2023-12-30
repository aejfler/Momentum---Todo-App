package com.smartbear.todoproject;
import com.smartbear.todoproject.entities.Todos;
import com.smartbear.todoproject.services.impl.TodosServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;

@Component
public class TodoScheduler {
    private TodosServiceImpl todosServiceImpl;

    public TodoScheduler(TodosServiceImpl todosServiceImpl) {
        this.todosServiceImpl = todosServiceImpl;
    }

    @Scheduled(fixedRate = 60000)
    public void checkAndSendNotifications() {
        List<Todos> todosToNotify = todosServiceImpl.checkDueForTodos();
        System.out.println("Todos to notify: " + todosToNotify);

        for (Todos todo : todosToNotify) {
            if (!todo.isNotificationSent() && !todo.isCompleted() && isDueDateInFuture(todo.getDuedate())) {
                todosServiceImpl.sendEmailNotification(todo);
                todo.setNotificationSent(true);
                System.out.println("is notification sent?  " + todo.isNotificationSent());
                todosServiceImpl.saveOrUpdate(todo);
            }
        }
    }

    private boolean isDueDateInFuture(Date dueDate) {
        LocalDateTime localDueDate = dueDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        LocalDateTime currentDate = LocalDateTime.now().plusHours(1);

        return localDueDate.isAfter(currentDate) && ChronoUnit.MILLIS.between(currentDate, localDueDate) <= 300000;
    }
}
