import { ref } from 'vue'
import { useToast, POSITION } from 'vue-toastification'

export interface PasswordRecoveryParams {
  cnpjcontrato: string
  cnpjloja: string
  username: string
}

export interface VerifyCodeParams extends PasswordRecoveryParams {
  codegen: string
}

export const usePasswordRecovery = () => {
  const toast = useToast()
  const isLoading = ref(false)
  const isResending = ref(false)

  /**
   * Solicita o código de recuperação de senha
   */
  const requestPasswordRecovery = async (params: PasswordRecoveryParams): Promise<boolean> => {
    isLoading.value = true
    
    try {
      const requestOptions = {
        method: "POST",
        redirect: "follow" as RequestRedirect
      }

      const url = `http://127.0.0.1:8940/api/auth/forgotpassword?cnpjcontrato=${params.cnpjcontrato}&cnpjloja=${params.cnpjloja}&username=${params.username}`
      
      const response = await fetch(url, requestOptions)
      const result = await response.text()
      
      if (response.ok) {
        toast.success('Código de recuperação enviado para seu email!', {
          position: POSITION.TOP_RIGHT,
          timeout: 5000
        })
        return true
      } else {
        toast.error(result || 'Erro ao solicitar recuperação de senha', {
          position: POSITION.TOP_RIGHT,
          timeout: 5000
        })
        return false
      }
    } catch (error) {
      console.error('Erro ao solicitar recuperação de senha:', error)
      toast.error('Erro ao conectar com o servidor', {
        position: POSITION.TOP_RIGHT,
        timeout: 5000
      })
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Verifica o código e gera nova senha temporária
   */
  const verifyCodeAndResetPassword = async (params: VerifyCodeParams): Promise<boolean> => {
    isLoading.value = true
    
    try {
      const requestOptions = {
        method: "POST",
        redirect: "follow" as RequestRedirect
      }

      const url = `http://127.0.0.1:8940/api/auth/sendcodegenerated?cnpjcontrato=${params.cnpjcontrato}&cnpjloja=${params.cnpjloja}&username=${params.username}&codegen=${params.codegen}`
      
      const response = await fetch(url, requestOptions)
      const result = await response.text()
      
      if (response.ok) {
        // Tentar fazer parse do JSON para verificar se é uma resposta de sucesso
        try {
          const jsonResult = JSON.parse(result)
          // Verificar se existe o campo "Ok" (maiúsculo) na resposta
          if (jsonResult.Ok) {
            toast.success(jsonResult.Ok, {
              position: POSITION.TOP_RIGHT,
              timeout: 5000
            })
            return true
          } else {
            // Se status 200 mas sem campo "Ok", tratar como erro
            toast.error(jsonResult.error || jsonResult.Error || 'Resposta inesperada do servidor', {
              position: POSITION.TOP_RIGHT,
              timeout: 5000
            })
            return false
          }
        } catch {
          // Se não for JSON válido com status 200, tratar como erro
          toast.error('Resposta inválida do servidor', {
            position: POSITION.TOP_RIGHT,
            timeout: 5000
          })
          return false
        }
      } else {
        // Qualquer status diferente de 200 é tratado como erro
        try {
          const jsonResult = JSON.parse(result)
          const errorMessage = jsonResult.error || jsonResult.Error || jsonResult.title || 'Código inválido ou expirado'
          toast.error(errorMessage, {
            position: POSITION.TOP_RIGHT,
            timeout: 5000
          })
        } catch {
          // Se não for JSON, mostrar o texto como está
          toast.error(result || 'Código inválido ou expirado', {
            position: POSITION.TOP_RIGHT,
            timeout: 5000
          })
        }
        return false
      }
    } catch (error) {
      console.error('Erro ao verificar código:', error)
      toast.error('Erro ao conectar com o servidor', {
        position: POSITION.TOP_RIGHT,
        timeout: 5000
      })
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Reenvia o código de recuperação
   */
  const resendCode = async (params: PasswordRecoveryParams): Promise<boolean> => {
    isResending.value = true
    
    try {
      const success = await requestPasswordRecovery(params)
      if (success) {
        toast.info('Código reenviado para seu email!', {
          position: POSITION.TOP_RIGHT,
          timeout: 4000
        })
      }
      return success
    } catch (error) {
      console.error('Erro ao reenviar código:', error)
      return false
    } finally {
      isResending.value = false
    }
  }

  return {
    isLoading,
    isResending,
    requestPasswordRecovery,
    verifyCodeAndResetPassword,
    resendCode
  }
}