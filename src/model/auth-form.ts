export type AuthFormProps = {
  formName: 'login' | 'register'
  buttonText: string
  formHandler: (values: { email: string, password: string }) => void
  setOnSignin: React.Dispatch<React.SetStateAction<boolean>>
}