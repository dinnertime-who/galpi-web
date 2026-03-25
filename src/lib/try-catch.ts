/**
 * 비동기 함수 실행 결과를 나타내는 성공 유형
 */
type Success<T> = {
  data: T;
  error: null;
  isSuccess: true;
};

/**
 * 비동기 함수 실행 결과를 나타내는 실패 유형
 */
type Failure<E> = {
  data: null;
  error: E;
  isSuccess: false;
};

/**
 * 비동기 함수 실행 결과의 통합 유형 (판별 유니온)
 */
type Result<T, E = Error> = Success<T> | Failure<E>;

/**
 * 비동기 함수를 안전하게 실행하고 결과를 표준화된 형식으로 반환합니다.
 *
 * @param promiseFn 실행할 비동기 함수
 * @returns 성공 또는 실패 결과를 담은 객체
 *
 * @example
 * // 비동기 함수 사용 예제
 * const { data, error, isSuccess } = await tryCatch(() => fetchData());
 * if (isSuccess) {
 *   // 성공 처리
 *   console.log(data);
 * } else {
 *   // 오류 처리
 *   console.error(error);
 * }
 */
export async function tryCatch<T, E = Error>(
  promiseFn: () => Promise<T>,
): Promise<Result<T, E>> {
  try {
    const data = await promiseFn();
    return { data, error: null, isSuccess: true };
  } catch (error) {
    return { data: null, error: error as E, isSuccess: false };
  }
}

/**
 * 동기 함수를 안전하게 실행하고 결과를 표준화된 형식으로 반환합니다.
 *
 * @param execution 실행할 동기 함수
 * @returns 성공 또는 실패 결과를 담은 객체
 *
 * @example
 * // 동기 함수 사용 예제
 * const { data, error, isSuccess } = tryCatchSync(() => parseJson(jsonString));
 * if (isSuccess) {
 *   // 성공 처리
 *   processData(data);
 * } else {
 *   // 오류 처리
 *   logError(error);
 * }
 */
export function tryCatchSync<T, E = Error>(execution: () => T): Result<T, E> {
  try {
    const data = execution();
    return { data, error: null, isSuccess: true };
  } catch (error) {
    return { data: null, error: error as E, isSuccess: false };
  }
}

/**
 * 비동기 함수를 실행하고 오류 발생 시 기본값을 반환합니다.
 *
 * @param promiseFn 실행할 비동기 함수
 * @param defaultValue 오류 발생 시 반환할 기본값
 * @returns 성공 시 함수 결과, 실패 시 기본값
 *
 * @example
 * // 기본값을 사용한 예제
 * const result = await tryCatchWithDefault(() => fetchUserData(userId), { name: 'Unknown' });
 * console.log(result); // 성공하면 사용자 데이터, 실패하면 { name: 'Unknown' }
 */
export async function tryCatchWithDefault<T>(
  promiseFn: () => Promise<T>,
  defaultValue: T,
): Promise<T> {
  try {
    return await promiseFn();
  } catch {
    return defaultValue;
  }
}
