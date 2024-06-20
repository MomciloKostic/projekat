package com.example.machinemanager.controller;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.machinemanager.model.Machine;
import com.example.machinemanager.model.Permission;
import com.example.machinemanager.model.Status;
import com.example.machinemanager.model.User;
import com.example.machinemanager.request.MachineRequest;
import com.example.machinemanager.request.ScheduleRequest;
import com.example.machinemanager.request.SearchRequest;
import com.example.machinemanager.services.MachineService;
import com.example.machinemanager.services.UserService;

@RestController
@CrossOrigin
@RequestMapping("/api/machine")
public class CRUDMachineController {

	private final UserService userService;
	private final MachineService machineService;
	private ArrayList<Machine> machineArrayList = new ArrayList<>();

	@Autowired
	PasswordEncoder passwordEncoder;

	public CRUDMachineController(UserService userService, MachineService machineService) {
		this.userService = userService;
		this.machineService = machineService;
	}

	@PostMapping(path = "/create", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> createMachine(@RequestBody MachineRequest machine) {
		try {
			if (checkPermissions("can_create_machines") == 0) {
				return ResponseEntity.status(403).build();
			}
			if (machine.getName() != "") {
				Machine m = new Machine(machine.getName());
				m.setCreatedBy(getUser());
				machineService.save(m);
				return ResponseEntity.ok(m);
			} else
				return ResponseEntity.status(400).build();
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(404).build();
		}
	}

	@PostMapping(path = "/search", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> searchMachine(@RequestBody SearchRequest machine) {
		try {
			List<Machine> machineList = machineService.findForUser(getUser());
			List<Machine> fList = new ArrayList<>();
			if (checkPermissions("can_search_machines") == 0) {
				return ResponseEntity.status(403).build();
			}

			if (machine.getName() == "" && machine.getDateFrom() == null && machine.getDateTo() == null
					&& machine.getStatus().isEmpty()) {
				return ResponseEntity.ok(machineService.findForUser(getUser()));
			}
			if (machine.getName() == "") {
				fList.addAll(machineList);
				machineList.clear();
				machineList.addAll(fList);
				fList.clear();
			} else {
				for (Machine m : machineList) {
					if (m.getName().toLowerCase().contains(machine.getName().toLowerCase())) {
						fList.add(m);
					}
				}
				System.out.println(machineList + "1. call");
				machineList.clear();
				machineList.addAll(fList);
				fList.clear();
			}
			if (!machine.getStatus().isEmpty()) {
				for (Machine m : machineList) {
					for (String s : machine.getStatus()) {
						System.out.println(s);
						if (m.getStatus().toString().toLowerCase().equals(s.toLowerCase()) && !fList.contains(m)) {
							fList.add(m);
						}
					}
				}
				System.out.println(machineList.toString() + "2. call");
				machineList.clear();
				machineList.addAll(fList);
				fList.clear();
			}
			if (machine.getDateTo() != null) {
				for (Machine m : machineList) {
					if (m.getCreateDate().compareTo(machine.getDateTo()) <= 0) {
						fList.add(m);
					}
				}
				System.out.println(machineList.toString() + "3. call");
				machineList.clear();
				machineList.addAll(fList);
				fList.clear();
			}
			if (machine.getDateFrom() != null) {
				for (Machine m : machineList) {
					System.out.println(m.getCreateDate());
					if (m.getCreateDate().compareTo(machine.getDateFrom()) >= 0) {
						fList.add(m);
					}
				}
				System.out.println(machineList.toString() + "4. call");
				machineList.clear();
				machineList.addAll(fList);
				fList.clear();
				System.out.println(machineList);
			}
			System.out.println(machineList);
			return ResponseEntity.ok(machineList);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(404).build();
		}
	}

	@PutMapping(path = "/destroy/{machineId}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> destroyMachine(@PathVariable Long machineId) {
		try {
			if (checkPermissions("can_destroy_machines") == 0) {
				return ResponseEntity.status(403).build();
			}

			Optional<Machine> optionalMachine = machineService.findById(machineId);
			if (optionalMachine.isPresent()) {
				System.out.println(optionalMachine + "sadasdadasdasd");
				Machine m = optionalMachine.get();
				// System.out.println(m.getStatus().equals("STOPPED") +"\n"+ m.getName() + "\n"
				// + m.getCreatedBy());
				if (m.getStatus().equals(Status.STOPPED) && m.isActive() && getUser().equals(m.getCreatedBy())) {
					m.setActive(false);
					machineService.save(m);
					return ResponseEntity.status(200).build();
				} else
					return ResponseEntity.status(400).build();

			} else
				return ResponseEntity.notFound().build();

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(404).build();
		}
	}

	@PutMapping(path = "/stop/{machineId}", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
	public synchronized ResponseEntity<?> stopMachine(@PathVariable Long machineId) {
		try {
			if (checkPermissions("can_stop_machines") == 0) {
				return ResponseEntity.status(403).build();
			}
			Optional<Machine> optionalMachine = machineService.findById(machineId);
			if (optionalMachine.isPresent()) {
				Machine m = optionalMachine.get();
				if (machineArrayList.contains(m)) {
					return ResponseEntity.status(400).build();
				}
				if (m.getStatus().equals(Status.RUNNING) && m.isActive() && getUser().equals(m.getCreatedBy())) {
					Thread tr = new Thread(() -> {
						try {
							machineArrayList.add(m);
							int rand = ThreadLocalRandom.current().nextInt(0000, 2000);
							System.out.println("BEFORE STOP\n" + Thread.activeCount());
							Thread.sleep(10000 + rand);
							System.out.println("AFTER STOP , RAND NUM: \n" + rand);
							m.setStatus(Status.STOPPED);
							machineService.save(m);
							machineArrayList.remove(m);
						} catch (Exception e) {
							e.printStackTrace();
						}
					});
					m.setStatus(Status.STOPPING);
					machineService.save(m);
					tr.start();

					return ResponseEntity.status(200).build();
				} else
					return ResponseEntity.status(400).build();

			} else
				return ResponseEntity.notFound().build();

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(404).build();
		}
	}

	@PutMapping(path = "/start/{machineId}", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
	public synchronized ResponseEntity<?> startMachine(@PathVariable Long machineId) {
		try {
			if (checkPermissions("can_start_machines") == 0) {
				return ResponseEntity.status(403).build();
			}
			Optional<Machine> optionalMachine = machineService.findById(machineId);
			if (optionalMachine.isPresent()) {
				Machine m = optionalMachine.get();
				if (machineArrayList.contains(m)) {
					return ResponseEntity.status(400).build();
				}
				System.out.println(m + "\n -------------------------");
				if (m.getStatus().equals(Status.STOPPED) && m.isActive() && getUser().equals(m.getCreatedBy())) {
					Thread tr = new Thread(() -> {
						try {
							machineArrayList.add(m);
							int rand = ThreadLocalRandom.current().nextInt(0000, 2000);
							System.out.println("BEFORE START\n" + Thread.activeCount());
							Thread.sleep(10000 + rand);
							System.out.println("AFTER START , RAND NUM: " + rand);
							m.setStatus(Status.RUNNING);
							machineService.save(m);
							machineArrayList.remove(m);
						} catch (Exception e) {
							e.printStackTrace();
						}
					});
					m.setStatus(Status.BOOTING);
					machineService.save(m);
					tr.start();

					return ResponseEntity.status(200).build();
				} else
					return ResponseEntity.status(400).build();

			} else
				return ResponseEntity.notFound().build();

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(404).build();
		}
	}

	@PutMapping(path = "/restart/{machineId}", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
	public synchronized ResponseEntity<?> restartMachine(@PathVariable Long machineId) {
		try {
			if (checkPermissions("can_restart_machines") == 0) {
				return ResponseEntity.status(403).build();
			}
			Optional<Machine> optionalMachine = machineService.findById(machineId);
			if (optionalMachine.isPresent()) {
				Machine m = optionalMachine.get();
				if (machineArrayList.contains(m)) {
					return ResponseEntity.status(400).build();
				}
				System.out.println(m + "\nsadasdadasdasd");
				if (m.getStatus().equals(Status.RUNNING) && m.isActive() && getUser().equals(m.getCreatedBy())) {
					Thread tr = new Thread(() -> {
						try {
							machineArrayList.add(m);
							int rand = ThreadLocalRandom.current().nextInt(0000, 1000);
							System.out.println("BEFORE SLEEP\n" + Thread.activeCount());
							Thread.sleep(4500 + rand);
							System.out.println("MACHINE STOPPED");
							m.setStatus(Status.STOPPED);
							machineService.save(m);
							System.out.println("BOOTING MACHINE\n");
							Thread.sleep(1000);
							m.setStatus(Status.BOOTING);
							machineService.save(m);
							Thread.sleep(4500 + rand);
							m.setStatus(Status.RUNNING);
							machineService.save(m);
							System.out.println("MACHINE RUNNING\n");
							machineArrayList.remove(m);
						} catch (Exception e) {
							e.printStackTrace();
						}
					});
					m.setStatus(Status.STOPPING);
					machineService.save(m);
					tr.start();

					return ResponseEntity.status(200).build();
				} else
					return ResponseEntity.status(400).build();

			} else
				return ResponseEntity.notFound().build();

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(404).build();
		}
	}

	@GetMapping("/loadMachines")
	public ResponseEntity<?> loadMachines() {
		List<Machine> ls = new ArrayList<>();
		ls.addAll(machineService.findForUser(getUser()));
		List<Machine> list = new ArrayList<>();
		for (Machine m : ls) {
			if (m.isActive()) {
				list.add(m);
			}
		}
		return ResponseEntity.ok(list);
	}

	@PutMapping(path = "/schedule", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> scheduleMachine(@RequestBody ScheduleRequest scheduleRequest) {
		try {
			Timestamp currTime = new Timestamp(System.currentTimeMillis());
			Timestamp schDate = scheduleRequest.getScheduleDate();
			System.out.println(scheduleRequest.getMachineId() + " GET MACHINE ");
			System.out.println(scheduleRequest.getScheduleDate() + " GET Scheadule time "
					+ scheduleRequest.getOperation() + " operation " + scheduleRequest.getMachineId() + " machine id");
			Long sleepTime = schDate.getTime() - currTime.getTime();
			Machine m = findMachine(scheduleRequest.getMachineId());
			System.out.println(m + "NE ZNAM STA SE DESAVAAA");
			Thread thread = new Thread(() -> {
				try {
					System.out.println(sleepTime + " \n\n\n SLEEP TIME \n\n\n");
					Thread.sleep(sleepTime);
					if (scheduleRequest.getOperation().toLowerCase().equals("restart")) {
						machineArrayList.add(m);
						m.setStatus(Status.STOPPING);
						machineService.save(m);
						int rand = ThreadLocalRandom.current().nextInt(0000, 1000);
						System.out.println("BEFORE SLEEP\n" + Thread.activeCount());
						Thread.sleep(4500 + rand);
						System.out.println("MACHINE STOPPED");
						m.setStatus(Status.STOPPED);
						machineService.save(m);
						System.out.println("BOOTING MACHINE\n");
						Thread.sleep(1000);
						m.setStatus(Status.BOOTING);
						machineService.save(m);
						Thread.sleep(4500 + rand);
						m.setStatus(Status.RUNNING);
						machineService.save(m);
						System.out.println("MACHINE RUNNING\n");
						machineArrayList.remove(m);
					} else if (scheduleRequest.getOperation().toLowerCase().equals("start")) {
						machineArrayList.add(m);
						m.setStatus(Status.BOOTING);
						machineService.save(m);
						int rand = ThreadLocalRandom.current().nextInt(0000, 2000);
						System.out.println("BEFORE START\n" + Thread.activeCount());
						Thread.sleep(10000 + rand);
						System.out.println("AFTER START , RAND NUM: " + rand);
						m.setStatus(Status.RUNNING);
						machineService.save(m);
						machineArrayList.remove(m);
					} else if (scheduleRequest.getOperation().toLowerCase().equals("stop")) {
						machineArrayList.add(m);
						m.setStatus(Status.STOPPING);
						machineService.save(m);
						int rand = ThreadLocalRandom.current().nextInt(0000, 2000);
						System.out.println("BEFORE STOP\n" + Thread.activeCount());
						Thread.sleep(10000 + rand);
						System.out.println("AFTER STOP , RAND NUM: \n" + rand);
						m.setStatus(Status.STOPPED);
						machineService.save(m);
						machineArrayList.remove(m);
					}

				} catch (Exception e) {
					e.printStackTrace();
				}
			});
			thread.start();
			return ResponseEntity.status(200).build();
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(404).build();
		}
	}

	public int checkPermissions(String permission) {
		UserDetails u = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		User user = userService.loadUserByEmail(u.getUsername());

		List<Permission> permList = user.getPermissions();
		for (Permission p : permList) {
			System.out.println(p.getPermissionName() + "/n");
			if (p.getPermissionName().equals(permission)) {
				return 1;
			}
		}
		return 0;
	}

	public Machine findMachine(Long id) {
		List<Machine> m = new ArrayList<>();
		m.addAll(machineService.findAll());
		for (Machine mach : m) {
			if (mach.getMachineId().equals(id)) {
				return mach;
			}
		}
		return null;
	}

	public User getUser() {
		UserDetails u = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		User user = userService.loadUserByEmail(u.getUsername());
		return user;
	}
}
