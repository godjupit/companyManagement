package org.example.studentmanagement.pojo;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class result {

    private Integer code;
    private String message;
    private Object data;

    public static result success() {
        return new result(1, "Success", null);
    }

    public static result success(Object data) {
        return new result(1, "Success", data);
    }

    public static result error(String message) {
        return new result(0, message, null);
    }
}
