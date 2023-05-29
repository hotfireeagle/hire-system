package util

func MapSlice[T any, M any](arr []T, convertFun func(T) M) []M {
	answer := make([]M, len(arr))

	for idx, item := range arr {
		answer[idx] = convertFun(item)
	}

	return answer
}