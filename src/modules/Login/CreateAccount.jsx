import {
  allowOnlyName,
  verifyValidEmail,
} from "@/HelperFunctions/helperFunctions";
import Input from "@/UI-Components/Input";

const CreateAccount = ({ register, errors, control }) => {
  return (
    <div className="gap-4 flex flex-col">
      <div className="space-y-2">
        <Input
          inputRef={register("name")}
          name={"name"}
          label={"Full Name"}
          isRequired
          maxLength={100}
          // errors={errors}
          showErrorMessage={errors?.name?.message}
          control={control}
          placeholder={"Enter your full name"}
          onChange={(e) => {
            allowOnlyName(e);
          }}
        />
      </div>
      <div className="space-y-2">
        <Input
          inputRef={register("email")}
          name={"email"}
          label={"Email"}
          // errors={errors}
           showErrorMessage={errors?.email?.message}
          maxLength={100}
          control={control}
          isRequired
          placeholder={"Enter your email"}
          onChange={(e) => {
            verifyValidEmail(e);
          }}
        />
      </div>
      {/* <div className="space-y-2">
        <Input
          inputRef={register("password")}
          type={"password"}
          name={"password"}
          label={"Password"}
          isRequired
          errors={errors}
          control={control}
          placeholder={"Enter your password"}
        />
      </div>
      <div className="space-y-2">
        <Input
          inputRef={register("re_enter_password")}
          type={"password"}
          name={"re_enter_password"}
          label={"Re-Enter Password"}
          isRequired
          errors={errors}
          control={control}
          placeholder={"Enter your password"}
        />
      </div> */}
    </div>
  );
};

export default CreateAccount;
