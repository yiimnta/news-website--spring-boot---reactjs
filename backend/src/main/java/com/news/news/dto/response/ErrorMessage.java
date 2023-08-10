package com.news.news.dto.response;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ErrorMessage {
    private int status;
    private Date date;
    private String message;
    private String description;
}
