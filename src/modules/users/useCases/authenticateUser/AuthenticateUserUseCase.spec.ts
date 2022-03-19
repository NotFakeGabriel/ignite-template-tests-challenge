import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  });


  it("shuld be able to authenticate a user", async () => {
    const user = {
      name: "User test",
      email: "test@example.com",
      password: "password"
    };
    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(result).toHaveProperty("token");
  });

  it("shuld not be able to authenticate a user with a non exists e-mail", async () => {
    expect(async () => {
      const user = {
        name: "User test",
        email: "test@example.com",
        password: "password"
      };
      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: "non.exists@email.com",
        password: user.password,
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  });

  it("shuld not be able to authenticate a user with a incorrect password", async () => {
    expect(async () => {
      const user = {
        name: "User test",
        email: "test@example.com",
        password: "password"
      };
      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "Incorrect password",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  });


})
