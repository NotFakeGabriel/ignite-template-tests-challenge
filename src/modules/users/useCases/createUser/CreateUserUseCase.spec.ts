import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })


  it("shuld be able to create a new user", async () => {
    const user = {
      name: "User test",
      email: "test@example.com",
      password: "password"
    }
    const createdUser = await createUserUseCase.execute(user);

    expect(createdUser).toHaveProperty("id")
  })
})
