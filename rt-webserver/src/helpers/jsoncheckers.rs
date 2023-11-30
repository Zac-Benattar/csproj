use axum::Json;

use crate::{
    generation::states,
    models::state::{State, StateMessageSeed},
};

// Following functions are pretty much unimplemented but are here to show how the code should be structured
pub fn invalid_scenario_generation_parameters_json(
    Json(scenario_generation_parameters): Json<&states::ScenarioGenerationParameters>,
) -> bool {
    empty_scenario_generation_parameters_json(Json(scenario_generation_parameters))
}

pub fn empty_scenario_generation_parameters_json(
    Json(scenario_generation_parameters): Json<&states::ScenarioGenerationParameters>,
) -> bool {
    !(scenario_generation_parameters.prefix.is_empty()
        || scenario_generation_parameters
            .prefix
            .to_ascii_lowercase()
            .contains("student")
        || scenario_generation_parameters
            .prefix
            .to_ascii_lowercase()
            .contains("police")
        || scenario_generation_parameters
            .prefix
            .to_ascii_lowercase()
            .contains("super")
        || scenario_generation_parameters
            .prefix
            .to_ascii_lowercase()
            .contains("helicopter"))
        || scenario_generation_parameters.user_callsign.is_empty()
        || scenario_generation_parameters.aircraft_type.is_empty()
}

pub fn invalid_state_data_json(Json(state): Json<&State>) -> bool {
    empty_state_data_json(Json(state))
}

pub fn empty_state_data_json(Json(state): Json<&State>) -> bool {
    state.callsign.is_empty() || state.prefix.is_empty()
}

pub fn invalid_state_message_seed_data_json(Json(state_message): Json<&StateMessageSeed>) -> bool {
    empty_state_message_seed_data_json(Json(state_message))
}

pub fn empty_state_message_seed_data_json(Json(state_message): Json<&StateMessageSeed>) -> bool {
    state_message.message.is_empty() || state_message.state.callsign.is_empty()
}
