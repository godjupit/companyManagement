package org.example.studentmanagement.mapper;


import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.example.studentmanagement.pojo.emp;
import org.example.studentmanagement.pojo.empQuery;

import java.util.List;

@Mapper
public interface empMapper {





    List<emp> page(empQuery empQuery);


    Long count(empQuery empQuery);
}
