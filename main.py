import random
import time

class NetworkSimulator:
    def __init__(self, nodes=10):
        self.nodes = nodes
        self.infected = [0]  # Start with node 0 infected
        
    def spread(self, malware_type="virus"):
        configs = {
            "virus": {"speed": 1.5, "prob": 0.6, "name": "VIRUS"},
            "worm": {"speed": 0.5, "prob": 0.9, "name": "WORM"},
            "trojan": {"speed": 2.0, "prob": 0.4, "name": "TROJAN"}
        }
        
        config = configs[malware_type]
        print(f"\n{'='*40}")
        print(f"  {config['name']} SIMULATION")
        print(f"{'='*40}")
        print(f"Network: {self.nodes} nodes")
        print(f"Patient zero: Node 0\n")
        
        step = 0
        while len(self.infected) < self.nodes:
            time.sleep(config['speed'])
            
            # Try to infect a new node
            available = [n for n in range(self.nodes) if n not in self.infected]
            if available and random.random() < config['prob']:
                new_victim = random.choice(available)
                self.infected.append(new_victim)
                
                integrity = round((1 - len(self.infected)/self.nodes) * 100)
                print(f"[Step {step}] Node {new_victim} infected! Integrity: {integrity}%")
                
            step += 1
            
            if step > 50:  # Safety limit
                break
        
        print(f"\n{'='*40}")
        print(f"SIMULATION COMPLETE")
        print(f"Total infected: {len(self.infected)}/{self.nodes}")
        print(f"Steps taken: {step}")
        print(f"{'='*40}\n")

# Run simulations
if __name__ == "__main__":
    # Virus simulation
    sim = NetworkSimulator(nodes=10)
    sim.spread("virus")
    
    # Worm simulation
    sim2 = NetworkSimulator(nodes=10)
    sim2.spread("worm")
    
    # Trojan simulation
    sim3 = NetworkSimulator(nodes=10)
    sim3.spread("trojan")