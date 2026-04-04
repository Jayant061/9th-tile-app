use std::vec;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn handle_move_number(
    mut grid_data: Vec<Vec<i32>>,
    row_index: usize,
    col_index: usize,
    grid_size: usize,
) -> Vec<Vec<i32>> {
    let current_number = grid_data[row_index][col_index];
    //left move
    if col_index != 0 && grid_data[row_index][col_index - 1] == 0 {
        grid_data[row_index][col_index - 1] = current_number;
        grid_data[row_index][col_index] = 0;
    }
    //right move
    else if col_index != (grid_size - 1) && grid_data[row_index][col_index + 1] == 0 {
        grid_data[row_index][col_index + 1] = current_number;
        grid_data[row_index][col_index] = 0;
    }
    //top move
    else if row_index != 0 && grid_data[row_index - 1][col_index] == 0 {
        grid_data[row_index - 1][col_index] = current_number;
        grid_data[row_index][col_index] = 0;
    }
    //bottom move
    else if row_index != (grid_size - 1) && grid_data[row_index + 1][col_index] == 0 {
        grid_data[row_index + 1][col_index] = current_number;
        grid_data[row_index][col_index] = 0;
    }
    grid_data
}

#[tauri::command]
fn is_move_valid(
    grid_data: Vec<Vec<i32>>,
    row_index: usize,
    col_index: usize,
    grid_size: usize,
) -> bool {
    (col_index != 0 && grid_data[row_index][col_index - 1] == 0) || //left
    (col_index != (grid_size - 1) && grid_data[row_index][col_index + 1] == 0) || //right
    (row_index != 0 && grid_data[row_index - 1][col_index] == 0) || // top
    (row_index != (grid_size - 1) && grid_data[row_index + 1][col_index] == 0) // bottom
}

#[tauri::command]
fn calulate_valid_moves(grid_data: Vec<Vec<i32>>, grid_size: usize) -> Vec<Vec<bool>> {
    let mut res = vec![vec![false; grid_size]; grid_size];
    for i in 0..grid_size {
        for j in 0..grid_size {
            res[i][j] = check_if_move_valid(&grid_data, i, j, grid_size);
        }
    }
    return res;
}

#[tauri::command]
fn get_stars(optimal_moves: i32, user_moves: i32) -> i32 {
    let ratio: f64 = (user_moves / optimal_moves) as f64;

    if ratio <= 1.5 {
        return 3;
    }
    if ratio <= 2.5 {
        return 2;
    };
    return 1;
}

fn check_if_move_valid(
    grid_data: &Vec<Vec<i32>>,
    row_index: usize,
    col_index: usize,
    grid_size: usize,
) -> bool {
    (col_index != 0 && grid_data[row_index][col_index - 1] == 0) || //left
    (col_index != (grid_size - 1) && grid_data[row_index][col_index + 1] == 0) || //right
    (row_index != 0 && grid_data[row_index - 1][col_index] == 0) || // top
    (row_index != (grid_size - 1) && grid_data[row_index + 1][col_index] == 0) // bottom
}

#[tauri::command]
fn is_game_won(grid_data: Vec<Vec<i32>>, grid_size: usize) -> bool {
    let mut expected_number;
    for i in 0..grid_size {
        for j in 0..grid_size {
            expected_number = (i * grid_size) + j + 1;
            if i == grid_size - 1 && j == grid_size - 1 && grid_data[i][j] == 0 {
                return true;
            } else if expected_number != grid_data[i][j] as usize {
                return false;
            }
        }
    }

    return true;
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            handle_move_number,
            is_move_valid,
            calulate_valid_moves,
            is_game_won,
            get_stars
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
