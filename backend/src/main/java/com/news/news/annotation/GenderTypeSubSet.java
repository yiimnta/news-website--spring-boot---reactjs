package com.news.news.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import com.news.news.model.Gender;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.Documented;

@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Constraint(validatedBy = GenderTypeSubSetValidator.class)
public @interface GenderTypeSubSet {
    Gender[] anyOf();

    String message() default "must be any of {anyOf}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
