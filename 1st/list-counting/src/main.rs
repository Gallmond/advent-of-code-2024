use std::{
    fs::File,
    io::{self, Read},
    path::Path,
    str::Lines,
};

fn main() {
    let data_file = Path::new("assets/number-lists.txt");
    let file_content = read_file(data_file).unwrap();

    let (left_list, right_list) = extract_lists(file_content.lines());

    let cumulative_dist = get_cumulative_dist(left_list, right_list);

    println!(
        "The cumulative distance between the two lists is: {}",
        cumulative_dist
    );
}

fn get_cumulative_dist(left_list: Vec<u32>, right_list: Vec<u32>) -> u32 {
    assert!(
        left_list.len() == right_list.len(),
        "The lists are not of the same length"
    );

    /*
     * 'zip' allows us to combine our two iterators into one, giving us tuples
     * with one element from each when we iterate over it. Handy.
     * 
     * 'fold' is like 'reduce' in other languages. In rust 'reduce' uses the
     * first element as the accumulator.
     * 
     * We have to use '*left_num' to dereference the pointer as we don't want
     * the pointer, we want the _actual value_.
     */
    left_list
            .iter()
            .zip(right_list)
            .fold(0, |mut acc, (left_num, right_num)| {
                acc += right_num.abs_diff(*left_num);
                acc
            })
}

fn extract_lists(lines: Lines) -> (Vec<u32>, Vec<u32>) {
    let mut left_list: Vec<u32> = Vec::new();
    let mut right_list: Vec<u32> = Vec::new();

    for line in lines {
        let numbers: Vec<&str> = line.split_whitespace().collect();
        if let Ok(left_num) = numbers[0].trim().parse::<u32>() {
            left_list.push(left_num);
        }
        if let Ok(right_num) = numbers[1].trim().parse::<u32>() {
            right_list.push(right_num);
        }
    }

    left_list.sort();
    right_list.sort();

    (left_list, right_list)
}

fn read_file(file_path: &Path) -> io::Result<String> {
    let mut file = File::open(file_path)?;
    let mut content = String::new();
    file.read_to_string(&mut content)?;
    Ok(content)
}
