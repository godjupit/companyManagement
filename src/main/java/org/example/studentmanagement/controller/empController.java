package org.example.studentmanagement.controller;

import lombok.extern.slf4j.Slf4j;
import org.example.studentmanagement.pojo.emp;
import org.example.studentmanagement.pojo.empQuery;
import org.example.studentmanagement.pojo.pageResult;
import org.example.studentmanagement.pojo.result;
import org.example.studentmanagement.service.empService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@CrossOrigin // Allow all cross-origin requests
public class empController {
    @Autowired
    private empService empService;


    @GetMapping("/emps")
    public result list(empQuery empQuery) {
        pageResult<emp> pageResult = empService.list(empQuery);
        return result.success(pageResult);
    }
}
