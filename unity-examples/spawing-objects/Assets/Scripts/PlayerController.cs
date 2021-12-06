using UnityEngine;
using UnityEngine.InputSystem;

public class PlayerController : MonoBehaviour
{
    [SerializeField] private float speed = 6f;
    private CharacterController controller;
    private PlayerInput input;
    private InputAction move;
    private InputAction mouseMove;
    private Vector3 direction;
    // Start is called before the first frame update
    void Start()
    {
        input = GetComponent<PlayerInput>();
        controller = GetComponent<CharacterController>();
        move = input.actions["Move"];
        mouseMove = input.actions["Look"];
    }

    // Update is called once per frame
    void Update()
    {
        Vector2 wasd = move.ReadValue<Vector2>();
        direction = new Vector3(wasd.x, 0f, wasd.y).normalized;
        Vector3 moveVelocity = direction * speed;
        controller.Move(direction * speed * Time.deltaTime);

        Vector3 mousePos = mouseMove.ReadValue<Vector2>();
        mousePos.z = Camera.main.farClipPlane * 0.5f;
        Vector3 worldPos = Camera.main.ScreenToWorldPoint(mousePos);
        transform.LookAt(new Vector3(worldPos.x,
            transform.position.y, worldPos.z));
    }
}
