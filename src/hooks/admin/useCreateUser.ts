import { create } from "zustand";
import { AxiosError } from "axios";
import apiClient from "../../services/api-client";
import { isAdmin } from "../../components/generic/DecodeToken";

interface CreateUserFormState {
  formErrors: { [key: string]: string };
  successMessage: string | null;
  userCreate: (
    formData: {
      username: string;
      email: string;
      password: string;
      fullName: string;
      gender: string;
      contactNo: string;
      hospital: string | null;
      bloodGroup: string;
      address: string;
      is_hospital_admin: boolean;
    },
    onSuccess: () => void
  ) => void;
}

export const useUserCreate = create<CreateUserFormState>((set) => ({
  formErrors: {},
  successMessage: null,
  userCreate: async (formData, onSuccess) => {
    const errors: { [key: string]: string } = {};

    if (!formData.username) errors.username = "Username is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.password) errors.password = "Password is required";
    if (!formData.fullName) errors.fullName = "Full name is required";
    if (!formData.gender) errors.gender = "Gender is required";
    if (!formData.contactNo) errors.contactNo = "Contact number is required";
    if (isAdmin && !formData.hospital) {
      errors.hospital = "Hospital is required";
    }
    if (!formData.bloodGroup) errors.bloodGroup = "Blood group is required";
    if (!formData.address) errors.address = "Address is required";

    set({ formErrors: errors });

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.error("Access token not found in localStorage.");
      set({
        formErrors: {
          server: "Access token not found. Please login again.",
        },
      });
      return;
    }

    if (Object.keys(errors).length === 0) {
      try {
        const response = await apiClient.post(
          "/users",
          {
            username: formData.username,
            email: formData.email,
            full_name: formData.fullName,
            address: formData.address,
            blood_group: formData.bloodGroup,
            gender: formData.gender,
            contact_no: formData.contactNo,
            password: formData.password,
            is_hospital_admin: formData.is_hospital_admin,
            hospital_id: formData.hospital,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.status === 201) {
          set({
            formErrors: {},
            successMessage: "Account has been added to the system.",
          });
          onSuccess();
        } else {
          set({
            formErrors: {
              server:
                "An unexpected error occurred during User creation. Please try again later.",
            },
          });
        }
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          const statusCode = error.response.status;
          const errorMessage =
            error.response.data.detail ||
            "An error occurred during User creation. Please try again later.";
          if (statusCode === 400) {
            const apiErrors = error.response.data.detail || {};
            if (apiErrors.includes("Username already registered")) {
              set({ formErrors: { username: "Username already registered" } });
            }
            if (apiErrors.includes("Email already registered")) {
              set({ formErrors: { email: "Email already taken" } });
            }
          } else {
            set({
              formErrors: {
                server: errorMessage,
              },
            });
          }
        } else {
          set({
            formErrors: {
              server:
                "An error occurred during User creation. Please try again later.",
            },
          });
        }
      }
    }
  },
}));
