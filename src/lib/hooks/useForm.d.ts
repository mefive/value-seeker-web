import * as _ from 'lodash';
import { ChangeEvent } from 'react';
import { ValuesType } from 'utility-types';
export interface FormProps<T> {
    defaultValues?: T | null;
    compare?: _.IsEqualCustomizer;
}
export interface RuleTypeComplex<T> {
    value: T;
    message: string;
}
export declare type RuleType<T> = RuleTypeComplex<T> | T;
export interface Rule<T> {
    required?: RuleType<boolean>;
    pattern?: RuleType<RegExp>;
    validate?: RuleType<(value: T) => boolean>;
}
export interface Rules<T> {
    [key: string]: Rule<ValuesType<T>>;
}
export interface Errors {
    [key: string]: string;
}
export interface Bind<T> {
    <P>(name: keyof T, rule?: Rule<P>): {
        value?: P;
        onChange: (value?: P | ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void;
    };
}
export interface UseForm<T> {
    bind: Bind<T>;
    reset: (values: T | null) => void;
    values: T;
    triggerValidation: (keys?: [keyof T]) => boolean;
    dirty: boolean;
    errors: Errors;
    setErrors: (errors: Errors) => void;
    getValues: () => T;
    setValue: (name: keyof T, value: any) => void;
    setValues: (values: T) => void;
}
declare function useForm<T extends {
    [key: string]: any;
}>(options: FormProps<T>): UseForm<T>;
export default useForm;
