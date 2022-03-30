import {Arg, Mutation, Query, Resolver} from 'type-graphql'

import {User} from '../models/User'

@Resolver()
export class UserResolver {
  private data: User[] = []

  @Query(() => [User]) //retorno de tipo lista de User
  async users() {
    return this.data
  }

  @Mutation(() => User) //retorno de tipo User
  async createUser(@Arg('name') name: string) {
    const user = {id: uid(), name}

    this.data.push(user)

    return user
  }
}

export function uid() {
  const head = Date.now().toString(36)
  const tail = Math.random().toString(36).substring(2, 15)

  return head + tail
}
