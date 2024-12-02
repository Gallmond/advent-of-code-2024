from typing import List

STEP_MIN = 1
STEP_MAX = 3

def run():
    lines = read_file()

    safe_count = 0
    for line in lines:
        numbers = line_to_numbers(line)
        if check_series(numbers) == True:
            safe_count += 1
    print(f"Safe count: {safe_count}")


def step_size_okay(prev_number: int, number: int) -> bool:
    diff = abs(number - prev_number)
    return diff >= STEP_MIN and diff <= STEP_MAX

def check_series(numbers: List[int]) -> bool:
    directions = []
    for index, number in enumerate(numbers):
        if index == 0: continue
        prev_number = numbers[index - 1]

        if step_size_okay(prev_number, number) == False: return False

        directions.append(
            1 if number > prev_number else
            -1
        )
        if latest_matches_previous(directions) == False: return False

    return True

def latest_matches_previous(list: List[int]) -> bool:
    if len(list) < 2: return True
    return list[-1] == list[-2]

def read_file() -> List[str]:
    with open('assets/puzzle-input.txt', 'r') as file:
        data = file.read().splitlines()
    return data

def line_to_numbers(string: str) -> List[int]:
    return list(map(int, string.split(' ')))

run()