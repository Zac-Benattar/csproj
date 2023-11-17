use axum::Json;

use crate::{generation::states, models::state::State};

// Following functions are pretty much unimplemented but are here to show how the code should be structured
pub fn invalid_scenario_generation_parameters_json(
    Json(scenario_generation_parameters): Json<&states::ScenarioGenerationParameters>,
) -> bool {
    empty_scenario_generation_parameters_json(Json(scenario_generation_parameters))
}

pub fn empty_scenario_generation_parameters_json(
    Json(scenario_generation_parameters): Json<&states::ScenarioGenerationParameters>,
) -> bool {
    scenario_generation_parameters.prefix.is_empty()
        || scenario_generation_parameters.user_callsign.is_empty()
}

pub fn invalid_state_data_json(
    Json(state): Json<&State>,
) -> bool {
    empty_state_data_json(Json(state))
}

pub fn empty_state_data_json(
    Json(state): Json<&State>,
) -> bool {
    state.callsign.is_empty()
        || state.prefix.is_empty()
}
