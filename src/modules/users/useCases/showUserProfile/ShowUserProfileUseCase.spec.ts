import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ShowUserProfileError } from "./ShowUserProfileError"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let inMemoryUsersRepository: InMemoryUsersRepository
let showUserProfileUseCase: ShowUserProfileUseCase
let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase

describe("Show User Profile", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  })


  it("shuld be able to show user profile", async () => {
    const user = {
      name: "User test",
      email: "test@example.com",
      password: "password"
    }
    await createUserUseCase.execute(user);
    const authenticatedUser = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })
    const userProfile = await showUserProfileUseCase.execute(authenticatedUser.user.id as string);

    expect(userProfile).toHaveProperty("id");
  });

  it("shuld not be able to show user profile of a non existing user", async () => {
    expect(async () => {
      const user = {
            name: "User test",
            email: "test@example.com",
            password: "password"
          }
      await createUserUseCase.execute(user);
      await showUserProfileUseCase.execute("nonExistingUserId");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });

})
