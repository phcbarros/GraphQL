import {FormEvent, useState} from 'react'
import {gql, useMutation} from '@apollo/client'
import {GET_USERS} from '../../App'

const CREATE_USER = gql`
  mutation ($name: String!) {
    createUser(name: $name) {
      id
      name
    }
  }
`

export function NewUserForm() {
  const [name, setName] = useState('')

  const [createUser, {data, loading, error}] = useMutation(CREATE_USER)

  async function handleCreateUser(event: FormEvent) {
    event.preventDefault()

    if (!name) {
      return
    }

    await createUser({
      variables: {
        name,
      },
      update: (cache, {data: {createUser}}) => {
        const {users} = cache.readQuery({query: GET_USERS})

        cache.writeQuery({
          query: GET_USERS,
          data: {
            users: {
              ...users,
              createUser,
            },
          },
        })
      },
      //refetchQueries: [GET_USERS],
    })

    setName('')
  }

  if (loading) {
    return <p>Cadastrando usuário</p>
  }

  if (error) {
    return <p>Erro</p>
  }

  return (
    <form onSubmit={handleCreateUser}>
      <label htmlFor="name">Name</label>
      <input
        id="name"
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <button type="submit">Enviar</button>
    </form>
  )
}
