import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { OperationType } from "../../entities/Statement";
import { AppError } from "../../../../shared/errors/AppError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";


let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Create Statement", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    )
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    )
  })

  it("shuld be able to get a user statement", async () => {
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
    const getStatement = await getStatementOperationUseCase.execute({
      user_id: createdUser.id as string,
      statement_id: statement.id as string
    })
    expect(getStatement).toHaveProperty("id");
  });
  it("shuld not be able to get a user statement from a inexistent user", async () => {
    expect(async () => {
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
      await getStatementOperationUseCase.execute({
        user_id: "nonExistingUserId",
        statement_id: statement.id as string
      })
    }).rejects.toBeInstanceOf(AppError)
  });
  it("shuld not be able to get a user statement from a inexistent statement", async () => {
    expect(async () => {
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
      await getStatementOperationUseCase.execute({
        user_id: createdUser.id as string,
        statement_id: "nonExistingStatementId"
      })
    }).rejects.toBeInstanceOf(AppError)
  });

})
