package com.news.news.annotation;

import java.util.Arrays;

import com.news.news.model.Gender;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class GenderTypeSubSetValidator implements ConstraintValidator<GenderTypeSubSet, Gender> {
    private Gender[] subset;

    @Override
    public void initialize(GenderTypeSubSet constraint) {
        this.subset = constraint.anyOf();
    }

    @Override
    public boolean isValid(Gender value, ConstraintValidatorContext context) {
        return value == null || Arrays.asList(subset).contains(value);
    }

}
