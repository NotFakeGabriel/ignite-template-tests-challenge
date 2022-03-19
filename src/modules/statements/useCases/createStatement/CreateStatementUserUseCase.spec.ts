import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { OperationType } from "../../entities/Statement";
import { AppError } from "../../../../shared/errors/AppError";


let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementsRepository)
  })

  it("shuld be able to make a deposit statement", async () => {
    const user = {
      name: "User test",
      email: "test@example.com",
      password: "password"
    }
    const createdUser = await createUserUseCase.execute(user);
    const statement = await createStatementUseCase.execute({
      user_id: createdUser.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "test deposit statement"
    })
    expect(statement).toHaveProperty("id");
  });

  it("shuld be able to make a withdraw statement", async () => {
    const user = {
      name: "User test",
      email: "test@example.com",
      password: "password"
    }
    const createdUser = await createUserUseCase.execute(user);
    await createStatementUseCase.execute({
      user_id: createdUser.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "test deposit statement"
    })
    const statement = await createStatementUseCase.execute({
      user_id: createdUser.id as string,
      type: OperationType.WITHDRAW,
      amount: 50,
      description: "test withdraw statement"
    })
    expect(statement).toHaveProperty("id");
  });

  it("shuld not be able to make a withdraw statement with insufficient funds", async () => {
    expect(async () => {
      const user = {
        name: "User test",
        email: "test@example.com",
        password: "password"
      }
      const createdUser = await createUserUseCase.execute(user);
      await createStatementUseCase.execute({
        user_id: createdUser.id as string,
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "test deposit statement"
      })
      await createStatementUseCase.execute({
        user_id: createdUser.id as string,
        type: OperationType.WITHDRAW,
        amount: 200,
        description: "test withdraw statement"
      })
    }).rejects.toBeInstanceOf(AppError)
  });
  it("shuld not be able to make a statement with a non existing user", async () => {
    expect(async () => {
      const user = {
        name: "User test",
        email: "test@example.com",
        password: "password"
      }
      const createdUser = await createUserUseCase.execute(user);
      await createStatementUseCase.execute({
        user_id: "nonExistingUserId",
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "test deposit statement"
      })
    }).rejects.toBeInstanceOf(AppError);
  });
})
