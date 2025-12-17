package org.example.studentmanagement.mapper;


import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.example.studentmanagement.pojo.emp;

import java.util.List;

@Mapper
public interface empMapper {




    @Select("select * from emp limit #{offset}, #{pageSize}")
    List<emp> page(@Param("offset") Long offset,@Param("pageSize") Integer pageSize);

    @Select("select count(*) from emp")
    Long count();
}
