export enum Status {
    "Parked" ,
    "Taxiing",
    "Holding",
    "TakeOff",
    "Airborne",
    "Descent",
    "Approach",
    "Landing",
    "Landed"
}

export type COMFrequency = {
    frequency_type: "AFIS" | "TWR" | "GND",
    frequency: number,
    callsign: string
}

export type Location = {
    lat: number,
    long: number
}

export type Pose = {
    location: Location,
    heading: number
}

export type HoldingPoint = {
    name: string
}

export type Runway = {
    name: string,
    holding_points: HoldingPoint[]
}

export type METORData = {
    avg_wind_direction: number,
    mean_wind_speed: number,
    std_wind_speed: number,
    mean_pressure: number,
    std_pressure: number,
    mean_temperature: number,
    std_temperature: number,
    mean_dewpoint: number,
    std_dewpoint: number,
}

export type METORDataSample = {
    wind_direction: number,
    wind_speed: number,
    pressure: number,
    temperature: number,
    dewpoint: number,
}

export type Aerodrome = {
    name: string,
    icao: string,
    com_freqs: COMFrequency[],
    runways: Runway[],
    lat: number,
    long: number,
    start_point: string,
    metor_data: METORData
}

export type ScenarioState = {
    status: Status,
    prefix: string,
    callsign: string,
    target_allocated_callsign: string,
    squark: boolean,
    current_target: COMFrequency,
    current_radio_frequency: number,
    current_transponder_frequency: number,
    location: Location,
    emergency: "None" | "Mayday",
    aircraft_type: string
}

export type TransponderDialMode = "OFF" | "SBY" | "GND" | "STBY" | "ON" | "ALT" | "TEST";

export type RadioMode = "OFF" | "COM" | "NAV";

export type RadioDialMode = "OFF" | "SBY"

export type StateMessageSeeds = {
    state: ScenarioState,
    message: string,
    scenario_seed: number,
    weather_seed: number
}

export type StateMessage = {
    state: ScenarioState,
    message: string
}

export type Mistake = {
    details: string,
    message: string
}

export type SimulatorSettings = {
    callsign: string,
    prefix: string,
    aircraftType: string,
}

export type RadioState = {
    mode: RadioMode,
    dial_mode: RadioDialMode,
    active_frequency: number,
    standby_frequency: number,
    tertiary_frequency: number,
}

export type TransponderState = {
    dial_mode: TransponderDialMode,
    frequency: number,
    ident_enabled: boolean,
    vfr_has_executed: boolean,
}