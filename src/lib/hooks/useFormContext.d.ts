import * as React from 'react';
import { UseForm } from './useForm';
declare function useFormContext<T>(): UseForm<T>;
export default useFormContext;
export declare function FormContext<T>(props: UseForm<T> & {
    children?: React.ReactElement;
}): JSX.Element;
