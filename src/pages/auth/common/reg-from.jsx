import React, { useState } from "react";
import { toast } from "react-toastify";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { API } from "@/utils/api"; // Assuming you have this imported
import Loading from "@/components/Loading";
import { validateEmail } from "@/constant/global_function";
import InputGroup from "@/components/ui/InputGroup";
import Icons from "@/components/ui/Icon";

// Yup schema with password confirmation validation
const schema = yup
	.object({
		username: yup.string().min(8, "ID pengguna perlu mempunyai minimum 8 aksara").max(20, "ID Pengguna tidak boleh lebih 20 aksara").required("Sila masukkan ID pengguna anda!"),
		email: yup.string().email("Invalid email").required("Sila masukkan email anda!"),
		password: yup.string().min(8, "Kata laluan perlu mempunyai minimum 8 aksara").max(20, "Kata laluan tidak boleh lebih 20 aksara").required("Sila masukkan kata laluan anda!"),
		confirmPassword: yup.string().oneOf([yup.ref("password"), null], "Kata laluan tidak sepadan").required("Sila sahkan kata laluan anda!"),
	})
	.required();

const RegForm = () => {
  
	const [loading, setLoading] = useState(false);
  	const { register, formState: { errors }, handleSubmit, reset, } = useForm({ resolver: yupResolver(schema), mode: "all" });
  	const navigate = useNavigate();

	const [see_password, set_see_password] = useState(false)

	const onSubmit = async (data) => {
		if (validateEmail(data.email) === false) {
		toast.error(
			"Format e-mel untuk e-mel institusi anda tidak sah. Sila pastikan format e-mel anda betul."
		);
		return false;
		}

    setLoading(true);

    try {
      // Making the API request using your API utility
      const response = await API("register", {
        username: data.username,
        email: data.email,
        password: data.password,
      });

      // Handling response directly without calling .json()
      if (response.status !== 200) {
        throw new Error(response.message || "Pendaftaran gagal");
      }

      // If successful
      reset();
      navigate("/");
      toast.success(response.message || "Pendaftaran berjaya!");
    } catch (error) {
      // Showing the error message to the user
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 ">
      <Textinput
        name="username"
        label="ID Pengguna (Wakil Institusi)"
        type="text"
        placeholder="Masukkan ID pengguna"
        register={register}
        error={errors.username}
        className="h-[48px]"
		maxLength={20}
		pattern="^\S+$"
		enableWhiteSpace={false}
      />
      <Textinput
        name="email"
        label="E-mel"
        type="email"
        placeholder="Masukkan E-mel"
        register={register}
        error={errors.email}
        className="h-[48px]"
      />
      <InputGroup
        name="password"
        label="Kata Laluan"
        type={"password"}
        placeholder="••••••••"
        register={register}
        error={errors.password}
        className="h-[48px]"
		hasicon={true}
		enableWhiteSpace={false}
		
      />
      <InputGroup
        name="confirmPassword"
        label="Sahkan Kata Laluan"
        type="password"
        placeholder="••••••••"
        register={register}
        error={errors.confirmPassword}
        className="h-[48px]"
		hasicon={true}
		enableWhiteSpace={false}
      />
      <Button
        type="submit"
        text="Daftar Akaun"
        className="btn bg-teal-600 text-white block w-full text-center"
        isLoading={loading}
      />
    </form>
  );
};

export default RegForm;
