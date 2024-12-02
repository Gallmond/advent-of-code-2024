from typing import List


def run():
    lines = read_file()

    # first part
    safe_count = 0
    for line in lines:
        numbers = line_to_numbers(line)
        if check_series(numbers) == True:
            safe_count += 1
    print(f"Safe count: {safe_count}")

    # second part
    safe_with_tolerance = check_series_with_tolerance(lines)
    print(f"Safe with tolerance: {safe_with_tolerance}")
 
# Given the following rules:
# - the difference between a number and it's neighbor cannot be less than one
#   or more than three
# - the series must increase or decrease, but not both
# how many entries in the list of lists are pass these rules with one or fewer
# violations?
def check_series_with_tolerance(lines: List[str]) -> int:
    numbers = [line_to_numbers(line) for line in lines]
    safe_count = 0

    for number_list in numbers:

        # if the series is immediately okay, we have passed
        if get_bad_number_index(number_list) == -1:
            safe_count += 1
            continue
        else:
            # if the series contains a bad number, iterate over all versions of
            # it with ONE of the numbers missing to check if any of them pass
            for i in range(len(number_list)):
                new_list = number_list.copy()
                new_list.pop(i)
                if get_bad_number_index(new_list) == -1:
                    safe_count += 1
                    break

    return safe_count


def get_bad_number_index(numbers: List[int]) -> int:
    STEP_MIN = 1
    STEP_MAX = 3

    directions = []
    for index, number in enumerate(numbers):
        if index == 0: continue
        prev_number = numbers[index - 1]

        step_size = abs(number - prev_number)
        if step_size < STEP_MIN or step_size > STEP_MAX:
            # number at this position breaks the step rule
            return index

        directions.append(1 if number > prev_number else -1)
        if len(directions) > 1 and directions[-2] != directions[-1]:
            # number at this position breaks the direction rule
            return index

    return -1


def num_between_inclusive(a: int, min: int, max: int) -> bool:
    return a >= min and a <= max

def step_size_okay(prev_number: int, number: int) -> bool:
    STEP_MIN = 1
    STEP_MAX = 3
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