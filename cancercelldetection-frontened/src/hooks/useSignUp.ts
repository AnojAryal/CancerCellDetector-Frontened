import { create } from 'zustand';
import apiClient from '../services/api-client';
import { AxiosError } from 'axios';

interface SignUpFormState {
  formErrors: { [key: string]: string };
  signUp: (formData: {
    username: string,
    email: string,
    password: string,
    fullName: string,
    gender: string,
    contactNo: string,
    bloodGroup: string,
    address: string,
  }) => void;
}

interface ErrorResponseData {
  errors: { [key: string]: string };
}

export const useSignUp = create<SignUpFormState>((set) => ({
  formErrors: {},
  signUp: async (formData) => {
    set({ formErrors: {} });

    const errors: { [key: string]: string } = {};
    if (!formData.username) {
      errors.username = 'Username is required';
    }
    if (!formData.email) {
      errors.email = 'Email is required';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    if (!formData.fullName) {
      errors.fullName = 'Full name is required';
    }
    if (!formData.gender) {
      errors.gender = 'Gender is required';
    }
    if (!formData.contactNo) {
      errors.contactNo = 'Contact number is required';
    }
    if (!formData.bloodGroup) {
      errors.bloodGroup = 'Blood group is required';
    }
    if (!formData.address) {
      errors.address = 'Address is required';
    }

    if (Object.keys(errors).length > 0) {
      set({ formErrors: errors });
      return;
    }

    try {
      const response = await apiClient.post("/users", {
        username: formData.username,
        email: formData.email,
        full_name: formData.fullName,
        address: formData.address,
        blood_group: formData.bloodGroup,
        gender: formData.gender,
        contact_no: formData.contactNo,
        password: formData.password,
      });
      

      if (response.status === 201) {
        console.log("Signup successful", response.data);
        set({ formErrors: {} });
      } else {
        console.error('Unexpected response during signup:', response);
        set({ formErrors: { server: 'An unexpected error occurred during signup. Please try again later.' } });
      }
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response && error.response.status === 422) {
        const responseData = error.response.data as ErrorResponseData;
        set({ formErrors: responseData.errors });
      } else {
        console.error('Error during signup:', error);
        set({ formErrors: { server: 'An error occurred during signup. Please try again later.' } });
      }
    }
  }
}));

function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError !== undefined;
}
